<?php

namespace App\Form;

use App\Entity\Song;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Vich\UploaderBundle\Form\Type\VichImageType;
use Symfony\Component\Validator\Constraints\File;

class SongType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name')
            ->add('duration')
            ->add('video_src')
            ->add('songFile', FileType::class, [
                'label' => 'Song',
                'mapped' => false,
                'required' => true,
                'constraints' => [
                    new File([
                        'mimeTypes' => [
                            'audio/mpeg',
                            'adio/vorbis',
                        ],
                        'mimeTypesMessage' => 'Please upload a valid audio file',
                    ])
                ],
            ])
            ->add('imageFile', VichImageType::class, [
                'required' => false,
                'allow_delete' => true,
                'download_uri' => true,
                'image_uri' => true,
                'asset_helper' => true,
                'imagine_pattern' => 'my_thumb'
            ])
            ->add('released_at')
            ->add('created_at')
            ->add('updated_at')
            ->add('artist')
            ->add('album')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Song::class,
        ]);
    }
}
